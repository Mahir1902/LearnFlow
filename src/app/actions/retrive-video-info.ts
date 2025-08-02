'use server'

import { createClient } from '@/lib/supabase/server'
import { waitForSnapshot } from '@/lib/wait-for-snapshot'
import { FilteredVideoInfo } from '@/types'
import axios from 'axios'
import { redirect } from 'next/navigation'




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

    const supabase = await createClient()

    const {data: userData, error: userError} = await supabase.auth.getUser()



    if(userError || !userData.user) {
        redirect('/login')
    }


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
        
        // console.log('response', response)

        const {snapshot_id} = response
        const snapshotRes = await waitForSnapshot(snapshot_id, 3, 10000)

        if(snapshotRes?.success && snapshotRes?.data) {
            const videoData = snapshotRes.data
            console.log('videoData', videoData)
            const filteredData: FilteredVideoInfo = {
                title: videoData[0].title || '',
                related_videos: videoData[0].related_videos || null,
                preview_image: videoData[0].preview_image || null,
                video_id: videoData[0].video_id || null,
            }

            console.log('filteredData', filteredData)

            return {
                success: true,
                data: filteredData,
                error: null,
            }
        }
        return {
            success: false,
            data: null,
            error: snapshotRes?.error || 'Failed to get snapshot data',
        }
        
    } catch (error) {
        console.log(error)
        return {
            success: false,
            data: null,
            error: error || 'Failed to retrieve video info',
        }
    }

}
