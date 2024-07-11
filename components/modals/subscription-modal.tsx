"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/use-modal-store";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { subscribeUser } from "@/lib/firebase-querys";
import { useState } from "react";

export const SubscriptionModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { toast } = useToast();
  const [flag, setFlag] = useState(false);

  const { profile } = data;

  const isModalOpen = isOpen && type === "subscribe";

  if (profile?.subscribed || flag) {
    return (
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              You are already subscribed to AkashaPlus!
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            <div className="w-full flex items-center justify-center mb-5">
              <div className="relative h-20 w-20">
                <Image
                  fill
                  src="/images/AkashaPlusLogo.png"
                  alt="AkashaPlus Logo"
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 80px)"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AYPqMlX2NdsJ62tQOQov3TVOv5DIZUVBlnnFyLjFTPitEL29s14U5hFgGXrfR0l2weJc2DIkzr6A14WU",
      }}
    >
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Subscribe to Akasha Plus
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            <div className="w-full flex items-center justify-center mb-5">
              <div className="relative h-20 w-20">
                <Image
                  fill
                  src="/images/AkashaPlusLogo.png"
                  alt="AkashaPlus Logo"
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 80px)"
                />
              </div>
            </div>
            <PayPalButtons
              style={{
                color: "blue",
                layout: "horizontal",
              }}
              createOrder={async () => {
                const res = await fetch("/api/checkout", {
                  method: "POST",
                });
                const order = await res.json();
                return order.id;
              }}
              onApprove={async (data, actions) => {
                const res = await actions.order?.capture();
                subscribeUser(profile?.id_user);
                setFlag(true);
                toast({
                  title: "Payment Successful",
                  description: "Welcome to AkashaPlus!",
                });
                console.log(data, res);
              }}
              onCancel={(data) => {
                toast({
                  variant: "destructive",
                  title: "Payment Cancelled",
                  description: "Try again later",
                });
                console.log(data);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </PayPalScriptProvider>
  );
};
