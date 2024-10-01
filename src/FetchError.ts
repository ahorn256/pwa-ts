export interface IFetchError {
  message: string;
  status?: number;
};

export function convertToFetchError(error: unknown):IFetchError {
  if(error instanceof FetchError) {
    return error;
  } else if(error instanceof Error) {
    return { message: error.message };
  } else if(error !== null && typeof error === 'object' && 'message' in error) {
    return error as IFetchError;
  } else {
    return { message: 'unknown error' };
  }
};

export class FetchError extends Error implements IFetchError {
  constructor(public message:string, public status?:number ) {
    super(message);
  }
}
