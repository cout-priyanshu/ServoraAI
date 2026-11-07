import mongoose, { model,Schema } from "mongoose";

interface Isettings{
    ownerId:string
    bussinessName:string
    supportEmail:string
    knowledge:string
}

const settingsSchema = new Schema<Isettings>({
    ownerId:{
        type:String,
        required:true,
        unique:true
    },
    bussinessName:{
        type:String
    },
    supportEmail:{
        type:String
    },
    knowledge:{
        type:String
    }
},{timestamps:true})

const Settings=mongoose.models.Settings || model("Settings",settingsSchema)

export default Settings