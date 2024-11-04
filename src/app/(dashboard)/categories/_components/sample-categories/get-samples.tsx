import { listCategories } from "../../actions";
import CreateFromSample from "./create-from-sample";
import sampleCategories from "./sampleCategories.json";

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