import { Button } from "@mui/material";
import {styled} from "@mui/material/styles";

interface ButtonProps {
  children: React.ReactNode;
  type: 'button-common-small'
}

const StyleCommonSmall = styled(Button)({
    height: '24px',
    fontSize: '0.875rem',
    textTransform: 'capitalize',
    minWidth: 'unset'
})

const CommiButton = ({children, type}: ButtonProps) => {

    switch (type) {
        case 'button-common-small':
            return <StyleCommonSmall variant={'outlined'} size={'small'}>{children}</StyleCommonSmall>
    }

    return <Button>
        {children}
    </Button>
}

export default  CommiButton