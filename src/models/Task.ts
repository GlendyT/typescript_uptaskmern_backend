import mongoose, {Schema, Document, Types} from "mongoose"

const taskStatus = {
    PENDING: "pending",
    ON_HOLD: "onHold",
    IN_PROGRESS: "inProgress",
    COMPLETED: "completed",
    UNDER_REVIEW: "underReview",  
} as const
export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

//PARA TYPESCRIPT
export interface ITask extends Document {
    name: string
    description: string
    project: Types.ObjectId
    status: TaskStatus
}


//PARA MONGOOSE
export const TaskSchema: Schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trip: true,
    },
    project: {
        type: Types.ObjectId,
        ref: "Project"
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    }
}, {timestamps: true})

const Task = mongoose.model<ITask>("Task", TaskSchema)
export default Task