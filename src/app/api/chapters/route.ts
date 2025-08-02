import { NextResponse } from "next/server"
import Innertube from "youtubei.js"



export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const videoId = searchParams.get("videoId")

    if (!videoId) {
        return NextResponse.json({error: "Video ID is required"}, {status: 400})
    }

    try {
        const tube = await Innertube.create()
        const info = await tube.getInfo(videoId)

        return NextResponse.json(info)
    } catch (error) {
        console.error("Error fetching chapters:", error)
        return NextResponse.json({error: "Failed to fetch chapters"}, {status: 500})
    }
}