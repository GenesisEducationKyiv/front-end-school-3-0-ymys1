import { useSelector } from "react-redux";
import { selectFilterOptions } from "../features/tracksList/tracksListSlice";
import { FilterPanel } from "../features/filterPanel/filterPanel";
import { TrackList } from "../features/tracksList/tracksList";

export default function TracksPage() {
    const { artists = [], genres = [] } = useSelector(selectFilterOptions) || { artists: [], genres: [] };

    return (
        <div className="flex flex-col gap-2 p-8 pb-0">
            <FilterPanel artists={artists} genres={genres} />
            <TrackList />
        </div>
    );
}