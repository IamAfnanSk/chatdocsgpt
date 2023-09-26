import { BookMarkedIcon, Bot, MessagesSquare } from "lucide-react";
import Image from "next/image";

const features = [
  {
    name: "Create a chatdocsgpt chat bot.",
    description:
      "Signin and create a new chat bot from the dashboard by providing asked details",
    icon: Bot,
  },
  {
    name: "Let it train.",
    description:
      "Once you privide asked details, chatdocsgpt run the task of fetching and processing the docs in background, just wait until its ready!.",
    icon: BookMarkedIcon,
  },
  {
    name: "Chat!!",
    description:
      "Chat with your newly created chatdocsgpt chat bot trained on the docs data provided by you! 🎉",
    icon: MessagesSquare,
  },
];

const Features: React.FC = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Didn't found your favuourite chatdocsgpt chat bot?
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            We got you covered
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            You can create a chat bot and train it on any docs which are in
            markdown format.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Image
            src="/images/dashboard.png"
            alt="App screenshot"
            className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            width={2432}
            height={1442}
          />
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <feature.icon
                  className="absolute left-1 top-1 h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                {feature.name}
              </dt>{" "}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export { Features };
