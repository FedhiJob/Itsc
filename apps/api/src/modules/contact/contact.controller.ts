import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";
import { contactService } from "./contact.service.js";
import type { InquiryQueryInput, SubmitContactInput, UpdateInquiryInput } from "./contact.schema.js";

function getParam(param: string | string[] | undefined, label: string): string {
  if (!param || Array.isArray(param)) {
    throw new AppError(400, `${label} parameter is required.`, "VALIDATION_001");
  }
  return param;
}

export const submitInquiry: RequestHandler = async (request, response, next) => {
  try {
    const input = request.body as SubmitContactInput;
    const inquiry = await contactService.submit(input);
    return sendSuccess(response, 201, "Your inquiry has been submitted successfully. We will get back to you soon.", inquiry);
  } catch (error) {
    return next(error);
  }
};

export const listInquiries: RequestHandler = async (request, response, next) => {
  try {
    const query = request.query as unknown as InquiryQueryInput;
    const result = await contactService.listInquiries(query);
    return sendSuccess(response, 200, "Inquiries retrieved successfully.", result);
  } catch (error) {
    return next(error);
  }
};

export const getInquiry: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    const inquiry = await contactService.getInquiry(id);
    return sendSuccess(response, 200, "Inquiry retrieved successfully.", inquiry);
  } catch (error) {
    return next(error);
  }
};

export const updateInquiry: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    const input = request.body as UpdateInquiryInput;
    const inquiry = await contactService.updateInquiry(id, input);
    return sendSuccess(response, 200, "Inquiry updated successfully.", inquiry);
  } catch (error) {
    return next(error);
  }
};
