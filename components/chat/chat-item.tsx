"use client";

import * as z from "zod";
import { DocumentData } from "firebase-admin/firestore";
import { format } from "date-fns";
import { UserAvatar } from "../user-avatar";
import { getProfile, getRole, updateMessage } from "@/lib/firebase-querys";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Edit, FileIcon, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltip";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  content: z.string().min(1),
});

interface RoleSchema {
  name: string;
  color: string;
  is_admin: boolean;
  rooms?: boolean | undefined;
  channels?: boolean | undefined;
  delete_messages?: boolean | undefined;
  kick?: boolean | undefined;
}

export const ChatItem = ({
  message,
  spaceId,
  roomId,
  channelId,
  profile,
}: {
  message: DocumentData;
  spaceId: string;
  roomId: string;
  channelId: string;
  profile:
    | DocumentData
    | {
        id_user: string;
        image_path: string | null | undefined;
        nickname: string | null | undefined;
        description: string;
      };
}) => {
  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: message.text,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const messageData = {
      id_user: message.id_user,
      text: values.content,
      edited: true,
      deleted: message.deleted,
      file_path: message.file_path,
      created_at: message.created_at,
    };
    await updateMessage(spaceId, roomId, channelId, message.id, messageData);
    form.reset();
    setIsEditing(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    form.reset({
      content: message.text,
    });
  }, [message.text, form]);

  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [userImg, setUserImg] = useState("");
  const [role, setRole] = useState<RoleSchema>({
    name: "",
    color: "",
    is_admin: false,
  });
  const [canDeleteMessage, setCanDeleteMessage] = useState(
    profile.id_user === message.id_user && !message.deleted
  );

  const canEditMessage =
    profile.id_user == message.id_user && message.file_path == "";
  getProfile(message.id_user).then((res) => {
    setNickname(res.nickname);
    setUserImg(res.image_path);
  });

  getRole(message.id_user, spaceId).then((res) => {
    setRole(res);
    (res.delete_messages || res.is_admin) &&
      !message.deleted &&
      setCanDeleteMessage(true);
  });

  const isImage =
    message.file_path !== "" && message.file_path.includes("images");
  const isDocument =
    message.file_path !== "" && message.file_path.includes("documents");
  const isWeather =
    message.file_path !== "" && message.file_path.includes("weather");

  let weatherData = {
    name: "",
    country: "",
    description: "",
    temp: 1,
    feels_like: 1,
    humidity: 1,
    wind_speed: 1,
    pressure: 1,
    icon: "",
    iconUrl: "",
  };

  if (isWeather) {
    var indexes = [],
      i = -1;
    while ((i = message.text.indexOf(";", i + 1)) >= 0) indexes.push(i);
    weatherData.name = message.text.substring(0, indexes[0]);
    weatherData.country = message.text.substring(indexes[0] + 1, indexes[1]);
    weatherData.description = message.text.substring(
      indexes[1] + 1,
      indexes[2]
    );
    weatherData.temp = parseFloat(
      message.text.substring(indexes[2] + 1, indexes[3])
    );
    weatherData.feels_like = parseFloat(
      message.text.substring(indexes[3] + 1, indexes[4])
    );
    weatherData.humidity = parseFloat(
      message.text.substring(indexes[4] + 1, indexes[5])
    );
    weatherData.wind_speed = parseFloat(
      message.text.substring(indexes[5] + 1, indexes[6])
    );
    weatherData.pressure = parseFloat(
      message.text.substring(indexes[6] + 1, indexes[7])
    );
    weatherData.icon = message.text.substring(indexes[7] + 1);
    weatherData.iconUrl =
      "https://openweathermap.org/img/wn/" + weatherData.icon + "@2x.png";
  }

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          {userImg === "" ? (
            <Skeleton className="h-7 w-7 md:h-10 md:w-10 bg-zinc-500 rounded-full" />
          ) : (
            <UserAvatar src={userImg} />
          )}
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              {nickname === "" ? (
                <Skeleton className="w-[70px] bg-zinc-500 h-4 " />
              ) : (
                <p className="font-semibold text-sm hover:underline cursor-pointer">
                  {nickname}
                </p>
              )}
              {role.name === "" ? (
                <Skeleton className="w-[40px] bg-zinc-500 h-4 -mt-[4px] ml-2" />
              ) : (
                <Badge
                  className={cn(
                    "text-white h-4 -mt-[4px] ml-2",
                    role.color === "green" &&
                      "bg-emerald-500 hover:bg-emerald-600",
                    role.color === "red" && "bg-rose-500 hover:bg-rose-600",
                    role.color === "blue" && "bg-indigo-500 hover:bg-indigo-600"
                  )}
                >
                  {role.name}
                </Badge>
              )}
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {message.created_at &&
                format(
                  new Date(message.created_at.toDate()),
                  "d MMM yyyy, HH:mm"
                )}
            </span>
          </div>
          {isImage && (
            <a
              href={message.file_path}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                fill
                src={message.file_path}
                alt="Channel"
                priority
                className="object-cover"
                sizes="(max-width: 48px)"
              />
            </a>
          )}
          {isDocument && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={message.file_path}
                target="_blank"
                rel="noopener moreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                Document File
              </a>
            </div>
          )}
          {isWeather && (
            <div
              className={cn(
                "w-[500px] h-[250px] bg-gradient-to-tr shadow-lg rounded-xl relative px-6 top-[10%] mt-2",
                weatherData.icon === "01d" &&
                  "from-sky-300 to-sky-100 text-black",
                weatherData.icon === "01n" &&
                  "from-slate-900 to-indigo-900 text-white",
                weatherData.icon === "02d" &&
                  "from-gray-400 to-sky-100 text-black",
                weatherData.icon === "02n" &&
                  "from-gray-950 to-slate-700 text-white",
                ["03d", "04d", "09d", "10d", "11d", "13d", "50d"].includes(
                  weatherData.icon
                ) && "from-gray-400 to-slate-200 text-black",
                ["03n", "04n", "09n", "10n", "11n", "13n", "50n"].includes(
                  weatherData.icon
                ) && "from-gray-950 to-gray-800 text-white"
              )}
            >
              <div className="flex justify-between w-full">
                <div className="w-1/2 my-4 mx-auto flex justify-between items-center">
                  <div className="flex flex-col items-start justify-between h-full">
                    <div>
                      <p className="text-xl">
                        {weatherData.name}, {weatherData.country}
                      </p>
                      <p className="text-sm">
                        {weatherData.description.charAt(0).toUpperCase() +
                          weatherData.description.slice(1)}
                      </p>
                    </div>
                    <div>
                      <h1 className="text-6xl font-semibold">
                        {weatherData.temp.toFixed()}°C
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 flex flex-col justify-between items-end">
                  <div className="relative h-[128px] w-[128px]">
                    <Image
                      fill
                      src={weatherData.iconUrl}
                      alt="wIcon"
                      priority
                      className="object-cover"
                      sizes="(max-width: 128px)"
                    />
                  </div>
                  <div className="flex flex-col justify-evenly gap-y-2 my-4 mx-auto text-xs">
                    <div className="flex justify-between gap-x-8">
                      <p>Feels Like</p>
                      <p className="font-bold w-20">
                        {weatherData.feels_like.toFixed()}°C
                      </p>
                    </div>
                    <div className="flex justify-between gap-x-8">
                      <p>Humidity</p>
                      <p className="font-bold w-20">
                        {weatherData.humidity.toFixed()} %
                      </p>
                    </div>
                    <div className="flex justify-between gap-x-8">
                      <p>Wind Speed</p>
                      <p className="font-bold w-20">
                        {weatherData.wind_speed.toFixed()} KPH
                      </p>
                    </div>
                    <div className="flex justify-between gap-x-8">
                      <p>Pressure</p>
                      <p className="font-bold w-20">
                        {weatherData.pressure.toFixed()} hPa
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {message.file_path === "" && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                message.deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {message.text}
              {message.edited && !message.deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {message.file_path === "" && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("", "deleteMessage", {
                  spaceId,
                  roomId,
                  channelId,
                  message,
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
