import type { Request, Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";

export class TaskController {
    static createTask = async (req: Request, res: Response) => {

        const { projectId } = req.params
        const project = await Project.findById(projectId)
        
        if(!project) {
            const error = new Error("Proyecto no encontrado")
            return res.status(404).json({error: error.message})
        }
        try {
            const task = new Task(req.body)
            await task.save()
            res.send("Tarea creada correctamente")
        } catch (error) {
            console.log(error)
        }
    }
}