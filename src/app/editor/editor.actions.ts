import {Action} from "@ngrx/store";
import {Image} from "../shared/image.model";

export const ADD_TO_SELECTION = 'ADD_TO_SELECTION';
export const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';
export const CLEAR_SELECTION = 'CLEAR_SELECTION';

export const SAVE_IMAGE = 'SAVE_IMAGE';
export const SAVE_IMAGE_SUCCESS = 'SAVE_IMAGE_SUCCESS';
export const SAVE_IMAGE_ERROR = 'SAVE_IMAGE_ERROR';

export function addToBulkEditList(path: string, fileName: string): Action {
    return {
        type: ADD_TO_SELECTION,
        payload: {
            path: path,
            fileName: fileName
        }
    };
}

export function removeFromBulkEditList(path: string, fileName: string): Action {
    return {
        type: REMOVE_FROM_SELECTION,
        payload: {
            path: path,
            fileName: fileName
        }
    };
}

export function clearSelection(): Action {
    return {
        type: CLEAR_SELECTION
    };
}

export function saveImage(image: Image): Action {
    return {
        type: SAVE_IMAGE,
        payload: image
    };
}

export function saveImageSuccess(image: Image): Action {
    return {
        type: SAVE_IMAGE_SUCCESS,
        payload: image
    };
}

export function saveImageError(error: string): Action {
    return {
        type: SAVE_IMAGE_ERROR,
        payload: error
    };
}