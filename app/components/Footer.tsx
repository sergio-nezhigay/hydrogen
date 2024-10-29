import {Phone, Clock, Mail, MapPin} from 'lucide-react';
import React from 'react';

import {Section} from '~/components/Text';
import {EnhancedMenu, useTranslation} from '~/lib/utils';

export const Footer = () => {
  const {translation} = useTranslation();
  const textColor = 'text-white/70';
  const linkStyle = `${textColor} ml-2 font-bold`;

  return (
    <Section
      divider="top"
      as="footer"
      padding="y"
      className={` min-h-[25rem] w-full items-start overflow-hidden bg-gray-900 py-8  ${textColor}`}
    >
      <ul className="grid list-none grid-cols-1 gap-4 p-0">
        <FooterItem
          icon={<Phone size={32} />}
          title={translation.phone}
          content={
            <a href="tel:+380980059236" className={linkStyle}>
              (098) 005-9236
            </a>
          }
        />
        <FooterItem
          icon={<Clock size={32} />}
          title={translation.working_hours}
          content={translation.working_hours_details}
        />
        <FooterItem
          icon={<Mail size={32} />}
          title="Email"
          content={
            <a href="mailto:info@informatica.com.ua" className={linkStyle}>
              info@informatica.com.ua
            </a>
          }
        />
        <FooterItem
          icon={<MapPin size={32} />}
          title={translation.address}
          content={
            <span className="ml-2 font-narrow">
              {translation.address_details}
            </span>
          }
        />
      </ul>
      <p className="mt-4 text-center text-sm text-gray-400 font-narrow">
        {translation.copyright}{' '}
        <a
          href="https://serhii.vercel.app/"
          className="text-gray-300 underline"
        >
          {translation.dev_site}
        </a>
      </p>
    </Section>
  );
};

interface FooterItemProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

function FooterItem({icon, title, content}: FooterItemProps) {
  return (
    <li className=" grid grid-cols-[50px_1fr] items-center whitespace-pre py-2">
      <div className="flex size-8 items-center justify-center ">{icon}</div>
      <div className="font-narrow">
        {title}
        {content}
      </div>
    </li>
  );
}
