import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import React from "react";
import { listCategories } from "../../actions";
import sampleCategories from "./sampleCategories.json";
import CreateFromSample from "./create-from-sample";

export async function SampleCategories() {
  const categories = await listCategories();

  const samples = sampleCategories.filter(
    (sample) => !categories.some((category) => category.name === sample.name),
  );

  return (
    <>
      {samples.map((category) => (
        <CreateFromSample key={category.id} category={category} />
      ))}
    </>
  );
}
