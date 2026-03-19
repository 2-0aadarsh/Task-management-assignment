import Task from "../models/task.model.js";

// Create Task
export const createTask = async (req, res) => {
    try {
      const { title, description, dueDate } = req.body;
  
      if (!title || title.trim() === "") {
        return res.status(400).json({
          status: "fail",
          message: "Task title is required",
        });
      }
  
      let parsedDueDate = null;

      // `dueDate` comes from a `<input type="date" />` as "YYYY-MM-DD".
      // Parse as date-only in *local time* to avoid timezone shifts.
      const parseDateOnly = (dateString) => {
        const parts = dateString.split("-").map(Number);
        if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

        const [year, month, day] = parts;
        const parsed = new Date(year, month - 1, day);
        if (Number.isNaN(parsed.getTime())) return null;
        parsed.setHours(0, 0, 0, 0);
        return parsed;
      };

      if (dueDate && dueDate !== "") {
        parsedDueDate = parseDateOnly(dueDate);

        if (!parsedDueDate) {
          return res.status(400).json({
            status: "fail",
            message: "Invalid due date format",
          });
        }

        // ✅ Prevent past date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (parsedDueDate < today) {
          return res.status(400).json({
            status: "fail",
            message: "Due date cannot be in the past",
          });
        }
      }
  
      const newTask = await Task.create({
        title: title.trim(),
        description,
        dueDate: parsedDueDate,
      });
  
      return res.status(201).json({
        status: "success",
        message: "Task created successfully",
        task: newTask,
      });
  
    } catch (error) {
      console.error('❌ Create Task Error:', error);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong while creating the task",
        error: error.message,
      });
    }
};


// Get Tasks (with filtering)
export const getTasks = async (req, res) => {
    try {
      const { filter, page = 1, limit = 10 } = req.query;
  
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
  
      const skip = (pageNumber - 1) * limitNumber;
  
      let query = {};
  
      // ================= FILTER LOGIC =================
      if (filter) {
        const now = new Date();
        let start, end;
  
        switch (filter.toLowerCase()) {
  
          case "today": {
            start = new Date();
            start.setHours(0, 0, 0, 0);
  
            end = new Date();
            end.setHours(23, 59, 59, 999);
            break;
          }
  
          case "tomorrow": {
            start = new Date();
            start.setDate(start.getDate() + 1);
            start.setHours(0, 0, 0, 0);
  
            end = new Date(start);
            end.setHours(23, 59, 59, 999);
            break;
          }
  
          case "thisweek": {
            const firstDay = new Date();
            firstDay.setDate(firstDay.getDate() - firstDay.getDay());
            firstDay.setHours(0, 0, 0, 0);
  
            const lastDay = new Date(firstDay);
            lastDay.setDate(firstDay.getDate() + 6);
            lastDay.setHours(23, 59, 59, 999);
  
            start = firstDay;
            end = lastDay;
            break;
          }
  
          case "lastweek": {
            const firstDay = new Date();
            firstDay.setDate(firstDay.getDate() - firstDay.getDay() - 7);
            firstDay.setHours(0, 0, 0, 0);
  
            const lastDay = new Date(firstDay);
            lastDay.setDate(firstDay.getDate() + 6);
            lastDay.setHours(23, 59, 59, 999);
  
            start = firstDay;
            end = lastDay;
            break;
          }
  
          case "thismonth": {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            break;
          }
  
          case "overdue": {
            query.dueDate = { $lt: new Date() };
            break;
          }
  
          case "upcoming": {
            query.dueDate = { $gte: new Date() };
            break;
          }
  
          default: {
            const months = {
              january: 0,
              february: 1,
              march: 2,
              april: 3,
              may: 4,
              june: 5,
              july: 6,
              august: 7,
              september: 8,
              october: 9,
              november: 10,
              december: 11,
            };
  
            if (months[filter.toLowerCase()] !== undefined) {
              const monthIndex = months[filter.toLowerCase()];
              start = new Date(now.getFullYear(), monthIndex, 1);
              end = new Date(now.getFullYear(), monthIndex + 1, 0, 23, 59, 59);
            }
          }
        }
  
        if (start && end) {
          query.dueDate = { $gte: start, $lte: end };
        }
      }
  
      // ================= MAIN QUERY =================
  
      const [tasks, totalTasks] = await Promise.all([
        Task.find(query)
          .sort({ dueDate: 1 }) // nearest first
          .skip(skip)
          .limit(limitNumber),
  
        // IMPORTANT: `Task.find()` excludes soft-deleted docs via a pre hook,
        // but `countDocuments()` does not. Count must match visible tasks.
        Task.countDocuments({ ...query, isDeleted: false })
      ]);
  
      const totalPages = Math.ceil(totalTasks / limitNumber);

       // ================= PAGE VALIDATION =================

      if (totalTasks > 0 && pageNumber > totalPages) {
        return res.status(400).json({
          status: "fail",
          message: "Page number exceeds total pages"
        });
      }
  
      return res.status(200).json({
        status: "success",
        message: "Tasks fetched successfully",
  
        pagination: {
          totalTasks,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1
        },
  
        tasks
      });
  
    } catch (error) {
      console.error('❌ Fetch Tasks Error:', error);
      return res.status(500).json({
        status: "error",
        message: "Unable to fetch tasks",
        error: error.message
      });
    }
};


// Mark Task Completed
export const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    if (task.status === "Completed") {
      return res.status(200).json({
        status: "success",
        message: "Task is already completed",
        task,
      });
    }

    task.status = "Completed";
    task.updatedAt = new Date();

    await task.save();

    return res.status(200).json({
      status: "success",
      message: "Task marked as completed",
      task,
    });

  } catch (error) {
    console.error('❌ Complete Task Error:', error);
    return res.status(500).json({
      status: "error",
      message: "Error updating task status",
      error: error.message,
    });
  }
};


// Soft Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    if (task.isDeleted) {
      return res.status(200).json({
        status: "success",
        message: "Task already deleted",
      });
    }

    task.isDeleted = true;
    task.deletedAt = new Date();

    await task.save();

    return res.status(200).json({
      status: "success",
      message: "Task soft deleted successfully",
      task,
    });

  } catch (error) {
    console.error('❌ Delete Task Error:', error);
    return res.status(500).json({
      status: "error",
      message: "Unable to delete task",
      error: error.message,
    });
  }
};