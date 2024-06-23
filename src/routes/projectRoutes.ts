import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExist } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

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

// TODO: ROUTES FOR TASKS
router.param("projectId", projectExist);

router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no valido"),
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
  hasAuthorization,
  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.deleteProject
);


router.post(
  "/:projectId/tasks",
  hasAuthorization,
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
  hasAuthorization,
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
  hasAuthorization,
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

//TODO ROUTES FOR TEAMS
router.post("/:projectId/team/find",
  body("email")
  .isEmail().toLowerCase().withMessage("Email no valido"),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
)
router.get("/:projectId/team",
  TeamMemberController.getProjectTeam
)

router.post("/:projectId/team",
  body("id")
  .isMongoId().withMessage("ID No valido"),
  handleInputErrors,
  TeamMemberController.addMemeberById
) 

router.delete("/:projectId/team/:userId",
  param("userId")
  .isMongoId().withMessage("ID No valido"),
  handleInputErrors,
  TeamMemberController.removeMemeberById
) 

// TODO ROUTES FOR NOTES
router.post("/:projectId/tasks/:taskId/notes",
  body("content")
  .notEmpty().withMessage("El Contenido de la nota es obligatorioa"),
  handleInputErrors,
  NoteController.createNote
)


router.get("/:projectId/tasks/:taskId/notes", 
  NoteController.getTaskNotes
)

router.delete("/:projectId/tasks/:taskId/notes/:noteId", 
  param("noteId").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  NoteController.deleteNote
)
export default router;
