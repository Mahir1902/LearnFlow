'use server'

import { waitForSnapshot } from '@/lib/wait-for-snapshot'
import axios from 'axios'




export const retriveVideoInfo = async (videoUrl: string) => {

    // try {
    //     const data = JSON.stringify({
    //         "url": videoUrl
    //     })

    //     const snaphotResponse = await axios.post(
    //         "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lk56epmy2i5g7lzu0k&include_errors=true",
    //         data,
    //         {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${process.env.BRIGHT_DATA_API_KEY}`
    //             }
    //         }
    //     )

    //     const {snapshot_id} = snaphotResponse.data
    //     const videoDetails = await waitForSnapshot(snapshot_id, 3, 10000)
        
    //     console.log("videoDetails", videoDetails)



        
    // } catch (error) {
    //     console.log(error)
    // }

    try {
        const data = JSON.stringify([{
            "url": videoUrl
        }])

        
        const {data: response} = await axios.post(
            "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lk56epmy2i5g7lzu0k&include_errors=true",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.BRIGHT_DATA_API_KEY}`
                }
            }
        ) // console.log("Video details:", response.data)
        
        console.log('response', response)

        const {snapshot_id} = response
        const videoDetails = await waitForSnapshot(snapshot_id, 3, 10000)
        return videoDetails
        
    } catch (error) {
        console.log(error)
        throw error
    }

}
