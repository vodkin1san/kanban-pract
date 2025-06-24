import { FirebaseError } from "firebase/app";

export const getFirebaseErrorMessage = (error: unknown): string => {
  let errorMessage = "Произошла ошибка входа, попробуйте повторить попытку!";

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-login-credentials":
        errorMessage = "Неверный email или пароль.";
        break;
      case "auth/invalid-email":
        errorMessage = "Неверный формат email.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Ошибка сети. Проверьте ваше подключение к интернету.";
        break;
      case "auth/email-already-in-use":
        errorMessage = "Этот email уже зарегистрирован. Пожалуйста, используйте другой.";
        break;
      case "auth/weak-password":
        errorMessage = "Пароль слишком простой, используйте более сложный.";
        break;
      default:
        errorMessage = "Произошла непредвиденная ошибка при входе. Пожалуйста, попробуйте снова.";
        break;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return errorMessage;
};
