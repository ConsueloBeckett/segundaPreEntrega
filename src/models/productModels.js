
import  mongoose from 'mongoose'

const productsCollection = "products"


const productsSchema = new mongoose.Schema({
    descripcion: { type: String, max: 1000, required: true },
    precio: { type: Number, max: 50, required: true },
    stock: { type: Number, max: 50, required: true },
    imagen: { type: String, max: 1000, required: true},
    categoria: { type: String, max: 50}
})
    
const productsModel = mongoose.model(productsCollection, productsSchema)

export default productsModel