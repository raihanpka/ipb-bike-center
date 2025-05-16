'use client';

import Image from 'next/image';
import * as React from 'react';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

export function LogoSidebar() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <Link href='/' className='flex items-center'>
            <div className='text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
              <Image
                src='/Logo.png'
                width='300'
                height='300'
                alt='IPB Bike Logo'
              />
            </div>
            <div className='flex flex-col gap-0.5 leading-none'>
              <span className='font-semibold'>IPB Bike Center</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
