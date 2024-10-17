<?php

namespace App\Twig;

use App\Traits\ImageTrait;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class ImagePathExtension extends AbstractExtension
{
    use ImageTrait;

    public function getFilters(): array
    {
        return [
            new TwigFilter('image_path', [$this, 'path'])
        ];
    }

    public function path(array $image = null): string
    {
        return $this->pathFromImage($image);
    }
}
