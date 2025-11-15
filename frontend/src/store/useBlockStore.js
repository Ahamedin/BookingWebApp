import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


export const useBlockStore = create((set,get) => ({
    blocks:[],
    loading:false,
    error:null,
    currentProduct:null,
    recommendedProduct:[],
    savedblocks:[],
    currentSavedBlock:[],
    booking:[],
   

    formData: {
        name:"",
        mobile:"",
        address:"",
    },

    formData2: {
        name:"",
        price:"",
        image:"",
        description:"",
    },

    setFormData2: (formData2)=> set({ formData2 }),
    resetForm2: () => set({ formData2: { name:"",price:"",image:"",description:""}}),

    addBlock: async(e) => {
        e.preventDefault();
        set({ loading:true});

        try {
            const {formData2} = get();
            await axios.post(`${BASE_URL}/api/blocks/modals`, formData2);
            await get().fetchBlocks();
            get().resetForm2();
            toast.success("Block added");
            document.getElementById("add_block_modal").close();
        } catch (error) {
            console.log("Error in Adding",error);
        } finally{
            set({ loading:false});
        }
    },



    setFormData: (formData)=> set({ formData }),
    resetForm: () => set({ formData: {name:"",mobile:"",address:""}}),

    addForm: async (e) =>{
        e.preventDefault();
        set({loading: true});

        try {
            const {formData} = get();
            await axios.post(`${BASE_URL}/api/blocks/bookings`,formData);
            await get().resetForm();
            toast.success("Form submitted!We Reach you soon");
        
        } catch (error) {
            console.log("Error in form submission",error);
        } finally {
            set({loading:false});
        }
    },

    fetchBlocks: async () => {
        set({loading:true});
        try {
            const response = await axios.get(`${BASE_URL}/api/blocks/modals`)
            set({blocks:response.data.data,error:null})
        } catch (error) {
            if(error.status === 429) set({error:"rate limited exceeded",blocks:[]});
            else set({error: "something went wrong",blocks:[]});
        } finally{
            set({loading:false});
        }
    },

    fetchBlock: async(id) =>{
        set({loading:true});
        try {
            const response = await axios.get(`${BASE_URL}/api/blocks/modals/${id}`);
            set({currentProduct:response.data.data,error:null})
            set({recommendedProduct:response.data.recommendedProduct,error:null})
        } catch (error) {
            console.log("Error in fetching",error);
            set({error: "something went wrong",currentProduct:null})
            set({error: "error in recommendedProduct",recommendedProduct:[]})
        } finally{
            set({loading:false});
        }
    },

    deleteBlock: async(id) =>{
        set({loading:true});
        try {
            await axios.delete(`${BASE_URL}/api/blocks/modals/${id}`);
            set(prev => ({blocks: prev.blocks.filter(block => block.id !== id)}));
            toast.success("Block deleted successfully");
        } catch (error) {
            console.error("Error in deleting blocks",error);
        } finally{
            set({loading:false});
        }
    },

    saveBlock: async(id) =>{
        set({loading:true});
        try {
            await axios.post(`${BASE_URL}/api/blocks/savepage`,{ id });
            toast.success("Saved Successfully!");
        } catch (error) {
            console.error("Error in saving the block",error);
            set({error:"error in saving",saveBlock:[]})
        } finally{
            set({loading:false});
        }
    },
// get all saved blocks
    getBlock: async() => {
        set({loading:true});
        try {
            const response = await axios.get(`${BASE_URL}/api/blocks/savedpage`);
            set({savedblocks:response.data.data,error:null})
            
        } catch (error) {
            console.error("Error in getsavedblocks",error);
        } finally{
            set({loading:false});
        }
    },

// get single saved blocks

    getSingle: async (id) => {
        set({loading:true});
        try {
            const response = await axios.get(`${BASE_URL}/api/blocks/savedpage/${id}`);
            set({currentSavedBlock:response.data.data,error:null});
        } catch (error) {
            set({error:"something went wrong",currentSavedBlock:null})
        } finally{
            set({loading:false});
        }
    },

    deleteSBlock: async (id) => {
        set({loading: true});
        try {
            await axios.delete(`${BASE_URL}/api/blocks/savedpage/${id}`);
            set(prev => ({savedblocks:prev.savedblocks.filter(savedblocks => savedblocks.id !== id)}));
            toast.success("Removed successfully!")
        } catch (error) {
            console.error("Error in remove saved blocks",error);
        } finally{
            set({loading: false});
        };
    },

    fetchBooking: async() => {
        set({loading:true});

        try {
            const response = await axios.get(`${BASE_URL}/api/blocks/booking`);
            set({booking:response.data.data,error:null});
        } catch (error) {
            console.log("Error in getBooking!",error);
        } finally{
            set({loading:false});
        }
    },
    searchBlocks: async (query) => {
        if (!query.trim()) {
            return get().fetchBlocks(); 
        }

        set({ loading: true });

        try {
            const response = await axios.get(`${BASE_URL}/api/blocks/search?q=${query}`);
            set({ blocks: response.data.data, error: null });
        } catch (error) {
            console.error("Search error:", error);
            set({ error: "Search failed", blocks: [] });
        } finally {
            set({ loading: false });
        }
    }
}));