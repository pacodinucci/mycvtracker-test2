import { apiInstance } from "./config";

export const submitAnswer = async (formData:FormData ) => {
	try {
		const response = await apiInstance.post(
			`/interviews/answer`,
            formData,
            {
                headers: {
                "Content-Type":'multipart/form-data'
            }
        }
		);
		if (response.status === 200) {
			return response.data;
		}
	} catch (e) {
		throw e;
	}
};

export const completeInterview = async (formData: FormData) => {
    try {
		const response = await apiInstance.post(
			`/interviews/complete`,
            formData,
            {
                headers: {
                "Content-Type":'multipart/form-data'
            }
        }
		);
		if (response.status === 200) {
			return response.data;
		}
	} catch (e) {
		throw e;
	}
}


export const submitMCQAnswer = async (token: string, questionId: number, option: string ) => {
	try {
		const response = await apiInstance.post(
			`/interviews/mcqAnswer?Candidate=${token}&questionId=${questionId}&option=${option}`
		);
		if (response.status === 200) {
			return response.data;
		}
	} catch (e) {
		throw e;
	}
};

export const completeMCQInterview = async (formData: FormData) => {
    try {
		const response = await apiInstance.post(
			`/interviews/completeMCQInterview`
		);
		if (response.status === 200) {
			return response.data;
		}
	} catch (e) {
		throw e;
	}
}
