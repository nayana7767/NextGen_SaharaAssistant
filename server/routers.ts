import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getAllLawyers, getLawyersByCategory, getChatHistory, saveChatMessage, getUserComplaints, createComplaint, getCaseFollowUps, saveCaseFollowUp } from "./db";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Lawyer routes
  lawyers: router({
    getAll: publicProcedure.query(async () => {
      return await getAllLawyers();
    }),
    
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await getLawyersByCategory(input.category);
      }),
  }),

  // Chat routes
  chat: router({
    sendMessage: protectedProcedure
      .input(z.object({ message: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Unauthorized");

        // Save user message
        await saveChatMessage(ctx.user.id, "user", input.message);

        // Get LLM response
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system" as const,
                content: "You are an empathetic legal assistant helping Indian citizens understand their rights. Always start your response with: 'Oh sorry, do you heard that? Here are the solution for it' followed by helpful legal guidance based on Indian laws."
              },
              {
                role: "user" as const,
                content: input.message
              }
            ]
          });

          const messageContent = response.choices[0]?.message?.content;
          const assistantMessage = typeof messageContent === 'string' ? messageContent : "I apologize, but I couldn't generate a response. Please try again.";
          
          // Save assistant response
          await saveChatMessage(ctx.user.id, "assistant", assistantMessage);

          return {
            success: true,
            message: assistantMessage
          };
        } catch (error) {
          console.error("LLM Error:", error);
          const fallbackMessage = "Oh sorry, do you heard that? Here are the solution for it\n\nI apologize, but I'm currently unable to process your request. Please try again later or contact our support team.";
          await saveChatMessage(ctx.user.id, "assistant", fallbackMessage);
          return {
            success: true,
            message: fallbackMessage
          };
        }
      }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      return await getChatHistory(ctx.user.id);
    }),
  }),

  // Complaint routes
  complaints: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        date: z.string(),
        location: z.string(),
        details: z.string(),
        lawyerId: z.number().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Unauthorized");

        const complaint = await createComplaint({
          userId: ctx.user.id,
          name: input.name,
          date: new Date(input.date),
          location: input.location,
          details: input.details,
          lawyerId: input.lawyerId || null,
          status: "draft"
        });

        return {
          success: true,
          complaint
        };
      }),

    getUserComplaints: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      return await getUserComplaints(ctx.user.id);
    }),
  }),

  // Case follow-up routes
  caseFollowUp: router({
    sendMessage: protectedProcedure
      .input(z.object({ message: z.string(), complaintId: z.number().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Unauthorized");

        // Save user message
        await saveCaseFollowUp(ctx.user.id, "user", input.message, input.complaintId);

        // Generate response
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system" as const,
                content: "You are a case follow-up assistant helping users track their legal cases. Always start your response with: 'Oh sorry, do you heard that? Here are the solution for it' followed by helpful case status updates and next steps."
              },
              {
                role: "user" as const,
                content: input.message
              }
            ]
          });

          const messageContent = response.choices[0]?.message?.content;
          const assistantMessage = typeof messageContent === 'string' ? messageContent : "I apologize, but I couldn't generate a response. Please try again.";
          
          // Save assistant response
          await saveCaseFollowUp(ctx.user.id, "assistant", assistantMessage, input.complaintId);

          return {
            success: true,
            message: assistantMessage
          };
        } catch (error) {
          console.error("LLM Error:", error);
          const fallbackMessage = "Oh sorry, do you heard that? Here are the solution for it\n\nI apologize, but I'm currently unable to process your request. Please try again later.";
          await saveCaseFollowUp(ctx.user.id, "assistant", fallbackMessage, input.complaintId);
          return {
            success: true,
            message: fallbackMessage
          };
        }
      }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      return await getCaseFollowUps(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
