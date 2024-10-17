<?php

namespace App\Twig;

use App\Traits\ImageTrait;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class ImageAltExtension extends AbstractExtension
{
    use ImageTrait;

    public function getFilters(): array
    {
        return [
            new TwigFilter('image_alt', [$this, 'alt'])
        ];
    }

    public function alt(array $image = null): string
    {
        return $this->altFromImage($image);
    }
}
