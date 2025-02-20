import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useToastify = () => {
  const notifyError = (message: string) => {
    toast.error(message, { position: 'top-right', autoClose: 3000,  });
  };

  const notifySuccess = (message: string) => {
    toast.success(message, { position: 'top-right', autoClose: 3000 });
  };

  const notifyInfo = (message: string) => {
    toast.info(message, { position: 'top-right', autoClose: 3000 });
  };

  return { notifyError, notifySuccess, notifyInfo };
};
