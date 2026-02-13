import { useNavigate } from "react-router-dom"

const navigate = useNavigate()

<Button
  size="sm"
  onClick={() => navigate(`/instances/${instance._id}`)}
>
  View
</Button>
