// import Itemmodel from "../models/Items.model.js";
// import { generateEmbedding } from "../services/embeddingService.js";


// const itemHandlers = {

//     itemEmbeded: async ({ itemId }) => {
//         const item = await Itemmodel.findById(itemId);

//         console.log("Worker received job:", itemId);

//         if (!item) return;

//         const embedding = await generateEmbedding(item.content);

//         item.embedding = embedding;

//         await item.save();
//         return
//     },

//     test: async({hello})=>{
//         console.log(hello);
//     }

// };

// export default itemHandlers;