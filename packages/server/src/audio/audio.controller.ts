import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as ytdl from 'ytdl-core';

@Controller('audio')
export class AudioController {
  @Get(':id')
  async getAudio(@Param('id') id: string, @Res() res: Response) {
    try {
        const audioData = await ytdl(id, { filter: 'audioonly' });
    
        res.setHeader('Content-Type', 'audio/mpeg');
        audioData.pipe(res);
    } catch (error) {
      console.error('Failed to get audio from YouTube.', error);
      res.status(500).send('Failed to get audio from YouTube.');
    }
  }
}