import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { customColors } from "@/shared-theme/themePrimitives";

function createData(
  name: number,
  calories: string,
  fat: string,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = Array.from({ length: 10 }).map((_, index) => createData(index + 1, "Beta-Q", "Beta0808-Q", 1129, 12.34));

const StyledHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: customColors.green01["400"],
  color: customColors.main.White,
  fontWeight: "bold",
  padding: "1px",
  height: "38px",
  fontSize: "1rem",
  minHeight: 0,
  borderBottom: "none",
  backgroundClip: "content-box",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.875rem",
  color: customColors.blue["200"],
  borderBottom: "none",
  padding: "1px",
  height: "35px",
  backgroundClip: "content-box",
}));

export default function LeaderTable() {
  return (
    <TableContainer component={Box} sx={{width: 'unset'}}>
      <Table sx={{width: 'unset'}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledHeadCell
              width={"64px"}
              align="center"
              sx={{ borderTopLeftRadius: "8px" }}
            >
              Rank
            </StyledHeadCell>
            <StyledHeadCell width={"148px"} align="center">
              Twitter Handle
            </StyledHeadCell>
            <StyledHeadCell width={"160px"} align="center">
              Community
            </StyledHeadCell>
            <StyledHeadCell width={"158px"} align="center">
              Airdrop Token
            </StyledHeadCell>
            <StyledHeadCell
              width={"100px"}
              align="center"
              sx={{ borderTopRightRadius: "8px" }}
            >
              Score
            </StyledHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{
                "&:nth-child(odd) td": {
                  backgroundColor: customColors.blue["600"],
                },
                "&:nth-child(even) td": {
                  backgroundColor: customColors.blue["1300"],
                },
              }}
            >
              <StyledTableCell align="center" width={"64px"} scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.calories}</StyledTableCell>
              <StyledTableCell align="center">{row.fat}</StyledTableCell>
              <StyledTableCell align="center">{row.carbs}</StyledTableCell>
              <StyledTableCell align="center">{row.protein}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
