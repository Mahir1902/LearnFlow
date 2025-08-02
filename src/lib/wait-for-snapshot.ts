import { getSnapshotData } from "./get-snapshot-data"

export const waitForSnapshot = async (snapshotId:string, maxAttempts: number, delay: number) => {

   try {
    for(let attempt = 0; attempt < maxAttempts; attempt++) {
        const response = await getSnapshotData(snapshotId)
        const snapshotData = response?.data
        if(snapshotData && response.success) {
            // console.log('snapshotData', snapshotData)
            return {
                success: true,
                data: snapshotData,
            }
        }



        await new Promise(resolve => setTimeout(resolve, delay))
        
    }
   } catch (error) {
    console.log(error)
    return {
        success: false,
        error: error || 'Timeout: Failed to get snapshot data',
    }
   }
    
}