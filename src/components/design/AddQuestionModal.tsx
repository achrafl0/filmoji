import { Dialog, Transition } from "@headlessui/react";
import type { NextComponentType, NextPageContext } from "next";
import { Fragment, useState } from "react";
import { Input } from "./Input";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { noop } from "lodash";
import { TRPCClientError } from "@trpc/client";

type Props = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
};
export const Modal: NextComponentType<NextPageContext, Props, Props> = ({
  isOpen,
  onClose,
}: Props) => {
  const [movieName, setMovieName] = useState<string>("");
  const [emojis, setEmojis] = useState<string>("");

  const { mutate: addQuestionMutation, isLoading: isSubmittingQuestion } =
    api.question.addQuestion.useMutation({
      onSuccess: () => {
        toast("C'est dans la boite");
        setEmojis("");
        setMovieName("");
        onClose();
      },
      onError: (error) => {
        setEmojis("");
        setMovieName("");

        if (error.data?.zodError) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const parsedError = JSON.parse(error.message)[0]
            .message as unknown as string;
          toast.error(parsedError);
          return;
        }
        toast.error("Oula t'a pété un truc, azy tag moi sur WA");
      },
    });
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => {
              isSubmittingQuestion ? onClose() : noop();
            }}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-primary-500 bg-white p-6 text-right align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-left text-lg font-medium leading-6 text-primary-500"
                >
                  Add question
                </Dialog.Title>
                <div className="mb-2 mt-2 text-left">
                  <p className="text-sm text-gray-500">
                    Faites pas les cons, mettez des trucs possible
                  </p>
                  <p className="text-xs italic text-gray-500">
                    ( hein Newtono , pas de films qui sortent en 2025)
                  </p>
                </div>
                <div className="mb-4 mt-4 text-left">
                  <p className="text-sm text-secondary-500">Movie Name</p>
                  <Input
                    placeholder="Fight club jsp"
                    value={movieName}
                    onChange={(movieNameInput) => setMovieName(movieNameInput)}
                  />
                  <p className="mt-2 text-sm text-secondary-500">Emojis</p>
                  <Input
                    placeholder="Emojis"
                    value={emojis}
                    onValidate={() =>
                      addQuestionMutation({
                        emojis,
                        name: movieName,
                      })
                    }
                    onChange={(emojiInput) => setEmojis(emojiInput)}
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-secondary-100 px-4 py-2 text-sm font-medium text-secondary-900 hover:bg-secondary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-100 px-4 py-2 text-sm font-medium text-primary-900 hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    onClick={() =>
                      addQuestionMutation({
                        emojis,
                        name: movieName,
                      })
                    }
                  >
                    Creér
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
