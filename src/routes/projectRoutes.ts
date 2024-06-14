import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExist } from "../middleware/project";
import { taskBelongsToProject, taskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate)

router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion del proyecto es obligatorio"),
  handleInputErrors,
  ProjectController.createProyect
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID no valido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion del proyecto es obligatorio"),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  ProjectController.deleteProject
);

// TODO: ROUTES FOR TASKS
router.param("projectId", projectExist);
router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion de la tarea es obligatorio"),
  handleInputErrors,
  TaskController.createTask
);
router.get("/:projectId/tasks", TaskController.getProjectTasks);

//TODO: AGREGAR UN MIDDLEWARE DONDE SE EMPIEZA A UTILIZAR taskID
router.param("taskId", taskExist);
router.param("taskId", taskBelongsToProject);
router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  TaskController.getTaskById
);
router.put(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no valido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion de la tarea es obligatorio"),
  handleInputErrors,
  TaskController.updateTask
);
router.delete(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  TaskController.deleteTask
);
router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no valido"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  handleInputErrors,
  TaskController.updateStatus
);

export default router;
