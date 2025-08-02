"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { retriveVideoInfo } from "@/app/actions/retrive-video-info";
import { useState } from "react";
import { embedAndStore } from "@/app/actions/embed-and-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// This is sample data.

// maybe create a check later
const formSchema = z.object({
  videoUrl: z.string().url({
    message: "Invalid youtube video link",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function YoutubeLinkForm() {

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()


  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      setIsLoading(true)
      const {data: videoData, success: videoDataSuccess} = await retriveVideoInfo(data.videoUrl)
      console.log('videoData', videoData)
      if(videoData && videoDataSuccess) {
      const res = await embedAndStore(data.videoUrl, videoData)
      if(res?.success && res?.chatId) {
        toast.success('Video embedded and stored successfully')
        form.reset()
        router.push(`/chat/${res.chatId}`)
      } else {
        toast.error('Failed to embed and store video')
      }
    }

      
      setIsLoading(false)

    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Plus />
              Add video
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
