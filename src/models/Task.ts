import mongoose, {Schema, Document, Types} from "mongoose"
import Note from "./Note"

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
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[]
    notes: Types.ObjectId[]
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
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: "User",
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: "Note"
        }
    ]
}, {timestamps: true})

//TODO MIDDLEWARE
TaskSchema.pre("deleteOne", {document: true}, async function() {

    const taskId = this._id
    if(!taskId) return 
    await Note.deleteMany({task: taskId})
})

const Task = mongoose.model<ITask>("Task", TaskSchema)
export default Task