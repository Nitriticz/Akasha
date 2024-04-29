"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { DocumentData } from "firebase-admin/firestore";
import { serverTimestamp } from "firebase/firestore";
import { sendMessage } from "@/lib/firebase-querys";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "@/components/emoji-picker";

interface ChatInputProps {
  spaceId: string;
  room: {
    id: string;
    name: string;
    description: string;
    image_path: string;
  };
  channel: {
    id: string;
    name: string;
    type: string;
  };
  profile:
    | DocumentData
    | {
        id_user: string;
        image_path: string | null | undefined;
        nickname: string | null | undefined;
        description: string;
      };
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({
  spaceId,
  room,
  channel,
  profile,
}: ChatInputProps) => {
  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    let messageData = {
      id_user: profile.id_user,
      text: value.content,
      file_path: "",
      edited: false,
      deleted: false,
      created_at: serverTimestamp(),
    };

    if (value.content.substring(0, 1) == "/") {
      switch (value.content) {
        case "/weather":
          let msg = "";
          messageData.file_path = "weather";
          await fetch(
            "https://api.openweathermap.org/data/2.5/weather?lat=-33.5000852&lon=-70.6162928&appid=162d41a40bb7f0e639ead952a9e598ee&units=metric"
          )
            .then((res) => res.json())
            .then((data) => {
              msg =
                data.name +
                ";" +
                data.sys.country +
                ";" +
                data.weather[0].description +
                ";" +
                data.main.temp +
                ";" +
                data.main.feels_like +
                ";" +
                data.main.humidity +
                ";" +
                data.wind.speed +
                ";" +
                data.main.pressure +
                ";" +
                data.weather[0].icon;
              messageData.text = msg;
            });
      }
    }

    await sendMessage(spaceId, room.id, channel.id, messageData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() =>
                      onOpen(profile.id_user, "messageFile", {
                        profile,
                        spaceId,
                        room,
                        channel,
                      })
                    }
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    autoComplete="off"
                    {...field}
                    placeholder={`Message #${channel.name}`}
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
