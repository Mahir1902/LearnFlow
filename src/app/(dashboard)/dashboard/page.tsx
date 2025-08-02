'use client'

import { Button } from "@/components/ui/button";
import { embedAndStore } from "@/app/actions/embed-and-store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";



const formSchema = z.object({
  videoUrl: z.string().url(),
})

export default function Page() {

  

  return (
    // <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    //   <Form {...form}>
    //     <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
    //       <FormField
    //         control={form.control}
    //         name="videoUrl"
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Video URL</FormLabel>
    //             <FormControl>
    //               <Input {...field} />
    //             </FormControl>
    //           </FormItem>
    //         )}
    //       />
    //       <Button type="submit">Submit</Button>
    //     </form>

    //   </Form>
    // </div>
    <div className="border h-full w-full">
      
    </div>
  );
}
