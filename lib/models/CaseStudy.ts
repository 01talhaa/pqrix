import { Schema, model, models, Document } from 'mongoose'

export interface ICaseStudy extends Document {
  title: string
  industry: string
  clientType: string
  challenge: string
  solution: string
  result: string
  image?: string
  metrics?: {
    label: string
    value: string
  }[]
  technologies?: string[]
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    title: {
      type: String,
      required: [true, 'Case study title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true
    },
    clientType: {
      type: String,
      required: [true, 'Client type is required'],
      trim: true
    },
    challenge: {
      type: String,
      required: [true, 'Challenge description is required'],
      trim: true
    },
    solution: {
      type: String,
      required: [true, 'Solution description is required'],
      trim: true
    },
    result: {
      type: String,
      required: [true, 'Result description is required'],
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    metrics: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true }
      }
    ],
    technologies: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: 'casestudies'
  }
)

// Index for faster queries
CaseStudySchema.index({ isActive: 1, order: 1 })

const CaseStudy = models.CaseStudy || model<ICaseStudy>('CaseStudy', CaseStudySchema)

export default CaseStudy
