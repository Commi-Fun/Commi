import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {customColors} from "@/shared-theme/themePrimitives";
import SearchIcon from "@/components/icons/SearchIcon";

export default function Search() {
    return (
        <OutlinedInput
            size="small"
            id="search"
            placeholder="Search…"
            sx={{
                flexGrow: 1,
                borderRadius: '60px',
                backgroundColor: customColors.blue["500"],
                width: '300px',
                height: '46px',
                pl: 1.25,
                pr: 3,
                fontSize: '1rem',
                fontWeight: 500,
                border: `1px solid ${customColors.blue["400"]}`,
            }}
            // startAdornment={
            //   <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            //     <SearchRoundedIcon fontSize="small" />
            //   </InputAdornment>
            // }
            endAdornment={
                <SearchIcon/>
            }
            inputProps={{
                'aria-label': 'search',
            }}
        />
    );
}
