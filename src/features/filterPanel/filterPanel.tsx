import { Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useSelector } from "react-redux";
import { selectFilterOptions } from "../tracksList/tracksListSlice";
import { SORT_OPTIONS } from "./constants/constants";
import { useFilterParams } from "../../shared/hooks/useFilterParams";

export const FilterPanel = () => {
    const { filters, updateFilters } = useFilterParams();
    const { artists = [], genres = [] } = useSelector(selectFilterOptions) || { artists: [], genres: [] };

    return (
        <div className="p-4 rounded-lg border border-[#E5E7EB] mb-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
                <div className="relative md:w-1/3">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search by title, artist or album..."
                        value={filters.search}
                        onChange={(e) => updateFilters({ search: e.target.value })}
                        className="pl-9 cursor-text"
                        data-testid="search-input"
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4 flex-1">
                    {/* Genre Filter - Dynamic from tracks */}
                    <div className="space-y-2 text-center">
                        <Label htmlFor="genre-filter" className="text-center block">Genre</Label>
                        <Select
                            value={filters.genre ?? "all"}
                            onValueChange={(value) => updateFilters({ genre: value === 'all' ? null : value })}
                            data-testid="filter-genre"
                        >
                            <SelectTrigger id="genre-filter" className="text-center cursor-pointer focus:ring-0 w-full">
                                <SelectValue placeholder="All Genres" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem className="cursor-pointer" value="all">All Genres</SelectItem>
                                {Array.isArray(genres) && genres.map((genre: string) => (
                                    <SelectItem key={genre} value={genre} className="cursor-pointer">
                                        {genre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Artist Filter - Dynamic from tracks */}
                    <div className="space-y-2 text-center">
                        <Label htmlFor="artist-filter" className="text-center block">Artist</Label>
                        <Select
                            value={filters.artist ?? "all"}
                            onValueChange={(value) => updateFilters({ artist: value === 'all' ? null : value })}
                            data-testid="filter-artist"
                        >
                            <SelectTrigger id="artist-filter" className="text-center cursor-pointer focus:ring-0 w-full">
                                <SelectValue placeholder="All Artists" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem className="cursor-pointer" value="all">All Artists</SelectItem>
                                {Array.isArray(artists) && artists.map((artist: string) => (
                                    <SelectItem key={artist} value={artist} className="cursor-pointer">
                                        {artist}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort By - Static from constants */}
                    <div className="space-y-2 text-center">
                        <Label htmlFor="sort-by" className="text-center block">Sort By</Label>
                        <Select
                            value={filters.sortBy ?? "title"}
                            onValueChange={(value) => updateFilters({ sortBy: value })}
                            data-testid="sort-select"
                        >
                            <SelectTrigger id="sort-by" className="text-center cursor-pointer focus:ring-0 w-full">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {SORT_OPTIONS.BY.map(({ value, label }) => (
                                    <SelectItem key={value} value={value} className="cursor-pointer">
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Order - Static from constants */}
                    <div className="space-y-2 text-center">
                        <Label htmlFor="sort-order" className="text-center block">Order</Label>
                        <Select
                            value={filters.sortOrder ?? "asc"}
                            onValueChange={(value) => updateFilters({ sortOrder: value as 'asc' | 'desc' })}
                        >
                            <SelectTrigger id="sort-order" className="text-center cursor-pointer focus:ring-0 w-full">
                                <SelectValue placeholder="Order" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-[#E5E7EB]">
                                {SORT_OPTIONS.ORDER.map(({ value, label }) => (
                                    <SelectItem key={value} value={value} className="cursor-pointer">
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;