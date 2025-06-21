import { getSnapshotData } from "./get-snapshot-data"

export const waitForSnapshot = async (snapshotId:string, maxAttempts: number, delay: number) => {

    console.log('snapshotId', snapshotId)


    for(let attempt = 0; attempt < maxAttempts; attempt++) {
        const snapshotData = await getSnapshotData(snapshotId)
        if(snapshotData !== null) {
            console.log('snapshotData', snapshotData)
            return snapshotData
        }



        await new Promise(resolve => setTimeout(resolve, delay))
        
    }
}