'use server';
import { EmailTemplate } from '@/components/EmailTemplate';
import React from 'react';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export const sendEmail = async (
  email: string,
  subject: string,
  name: string,
  itemName: string,
  lastBidAmount: number,
  itemLink: string
) => {
  resend.emails.send({
    from: 'Auctionaire <onboarding@resend.dev>',
    to: email,
    subject: subject,
    react: React.createElement(EmailTemplate, {
      recName: name,
      itemName: itemName,
      lastBidAmount: lastBidAmount,
      itemLink: itemLink,
    }),
    // react: <EmailTemplate recName='Vathana' itemName='itemName' lastBidAmount={10} itemLink={'hi'} />,
  });
};
