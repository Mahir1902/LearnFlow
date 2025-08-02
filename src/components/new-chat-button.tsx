import React from 'react'
import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Link } from "lucide-react";
import YoutubeLinkForm from "./forms/YoutubeLinkForm";

export default function NewChatButton() {
  return (
    <Dialog>
          <DialogTrigger asChild>
            <div className="w-full px-2">
              <Button className="w-full">
                <Link />
                New Chat
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="w-md">
            <DialogHeader>
              <DialogTitle>Enter a youtube video link</DialogTitle>
            </DialogHeader>
            <YoutubeLinkForm />
          </DialogContent>
        </Dialog>
  )
}
