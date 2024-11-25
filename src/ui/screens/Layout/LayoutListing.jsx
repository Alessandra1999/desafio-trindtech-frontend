import { useState } from "react";
import DynamicHeader from "../../components/Header/DynamicHeader";
import Search from "../../components/Listing/Search";
import List from "../../components/Listing/List";

function LayoutListing() {

    const [searchResults, setSearchResults] = useState([]);

    return (
        <>
            <DynamicHeader
                showLogo={true}
            />
            <Search setSearchResults={setSearchResults} />
            <List searchResults={searchResults} />
        </>
    );
};

export default LayoutListing;