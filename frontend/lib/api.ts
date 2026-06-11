import axios from 'axios'
const API = axios.create({baseURL: process.env.NEXT_PUBLIC_API_URL||'http://localhost:8080',timeout:300000})
export const runAgent = async(agent_id:string,query:string)=>{
  const {data} = await API.post('/run',{agent_id,query,session_id:`s-${Date.now()}`})
  return data
}
export const getAgents = async()=>{const {data}=await API.get('/agents');return data}
export const getHealth = async()=>{const {data}=await API.get('/health');return data}
export const getTraces = async()=>{const {data}=await API.get('/argus/traces');return data}