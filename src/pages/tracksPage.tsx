import { FilterPanel } from "../features/filterPanel/filterPanel";
import { TrackList } from "../features/tracksList/tracksList";

export default function TracksPage() {
    return (
        <div className="flex flex-col gap-2 p-8 pb-0">
            <FilterPanel />
            <TrackList />
        </div>
    );
}