"use client";

import { FormEvent, useState } from "react";
import { addPatient } from "../providerDashboard/providerApi";

export default function AllowListForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setPending(true);

    const result = await addPatient({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
    });

    setPending(false);

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }

    setMessage(result.success ?? "Added to the allow list");
    setFirstName("");
    setLastName("");
    setEmail("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full w-full flex-col gap-3 rounded-2xl border-2 p-4 shadow-md"
    >
      <div className="flex flex-col gap-2">
        <h3 className="w-fit border-b-4 border-black pb-1 font-serif text-3xl text-black">
          Add To Allow List
        </h3>
        <p className="font-inter text-xs text-[#2B2B2B]">
          People on this list can create an account with the email you enter.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <label className="flex flex-col gap-1 font-inter text-sm text-black">
          First name
          <input
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="rounded-2xl border-2 px-3 py-2 outline-none"
            placeholder="First Name"
          />
        </label>
        <label className="flex flex-col gap-1 font-inter text-sm text-black">
          Last name
          <input
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="rounded-2xl border-2 px-3 py-2 outline-none"
            placeholder="Last Name"
          />
        </label>
        <label className="flex flex-col gap-1 font-inter text-sm text-black">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-2xl border-2 px-3 py-2 outline-none"
            placeholder="example@clinic.com"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-[#45733F] px-4 py-2 font-inter text-sm font-medium text-white hover:cursor-pointer hover:bg-[#3A6235] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Adding..." : "Add patient"}
      </button>

      {error && (
        <p className="font-inter text-base text-[#D93737]">{error}</p>
      )}
      {message && (
        <p className="font-inter text-base text-[#45733F]">{message}</p>
      )}
    </form>
  );
}
