import { connect } from "mongoose"

const mongo_Url=process.env.MONGODB_URL
if(!mongo_Url){
    console.log("mongodb url not found")
}
let cache=global.mongoose
if(!cache){
    cache= global.mongoose={conn:null,promise:null}
}

const connectDb = async ()=>{
    if(!cache.conn){
        return cache.conn
    }
    if(!cache.promise){
        cache.promise=connect(mongo_Url!).then((c)=>c.connection)
    }
    try{
        const conn=await cache.promise
    } catch (error){
        console.log(error)
    }
    return cache.conn
}

export default connectDb