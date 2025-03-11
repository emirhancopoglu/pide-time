import Breadcrump from "@/components/breadcrump/breadcrump";
import CountdownPanel from "@/components/countdown-panel/countdown-panel";
import IftarSearch from "@/components/search/iftar-search";

export default function Page() {
  return (
    <>
      <Breadcrump />
      <IftarSearch />
      <CountdownPanel />
    </>
  );
}
