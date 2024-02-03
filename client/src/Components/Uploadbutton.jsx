import {Button} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function UploadButton({handleImageChange}) {
    const handleFileInput = (e) => {
        if (e.target.files[0]) {
            handleImageChange(e.target.files[0]);
        }
    }
    return (
        <Button
            variant="contained"
            component="label"
            margin ="normal"
            startIcon={<CloudUploadIcon />}
            sx={{margin: "10px"}}
        >
        Upload Profile Picture
            <input
                type="file"
                hidden
                onChange={handleFileInput}
            />
        </Button>
    );
}
export default UploadButton;