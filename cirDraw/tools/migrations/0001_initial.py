# Generated by Django 2.2.3 on 2019-08-01 08:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='chromosome_length',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('assembly', models.CharField(max_length=100)),
                ('chr_num', models.CharField(max_length=50)),
                ('chr_length', models.IntegerField()),
            ],
            options={
                'db_table': 'chromosome_length',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='species_circRNAs',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gene', models.CharField(max_length=255)),
                ('transcript', models.CharField(max_length=255)),
                ('chr_num', models.CharField(max_length=50)),
                ('start', models.IntegerField()),
                ('end', models.IntegerField()),
                ('components', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='species_genome_exons_introns',
            fields=[
                ('gene', models.CharField(max_length=255)),
                ('transcript', models.CharField(max_length=255)),
                ('exin_type', models.CharField(max_length=255)),
                ('chr_num', models.CharField(max_length=50)),
                ('start', models.IntegerField()),
                ('end', models.IntegerField()),
                ('strand', models.CharField(max_length=2)),
                ('id_en', models.CharField(db_column='id', max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('modifications', models.TextField()),
                ('id_notuse', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='species_genome_genes',
            fields=[
                ('chr_num', models.CharField(max_length=50)),
                ('start', models.IntegerField()),
                ('end', models.IntegerField()),
                ('strand', models.CharField(max_length=2)),
                ('id_en', models.CharField(db_column='id', max_length=255, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('gene_type', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='species_genome_transcripts',
            fields=[
                ('gene', models.CharField(max_length=255)),
                ('chr_num', models.CharField(max_length=50)),
                ('start', models.IntegerField()),
                ('end', models.IntegerField()),
                ('strand', models.CharField(max_length=2)),
                ('id_en', models.CharField(db_column='id', max_length=255, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='StatisticTable',
            fields=[
                ('md5', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('lenChart', models.TextField()),
                ('toplist', models.TextField()),
            ],
            options={
                'db_table': 'StatisticTable',
            },
        ),
        migrations.CreateModel(
            name='UploadParametersMD5',
            fields=[
                ('md5', models.CharField(db_column='MD5', max_length=32, primary_key=True, serialize=False)),
                ('status', models.IntegerField(db_column='Status')),
                ('file_type', models.CharField(db_column='FileType', max_length=100)),
                ('path', models.CharField(db_column='path', max_length=200)),
                ('species', models.CharField(db_column='Species', max_length=255)),
                ('time', models.FloatField(db_column='time_created')),
            ],
            options={
                'db_table': 'tools_uploadmd5',
            },
        ),
        migrations.CreateModel(
            name='UserDensity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('md5', models.CharField(max_length=255)),
                ('gene_id', models.CharField(db_column='gene_id', default='', max_length=255)),
                ('chr_num', models.CharField(max_length=100)),
                ('start', models.IntegerField()),
                ('end', models.IntegerField()),
                ('name', models.CharField(max_length=255)),
                ('gene_type', models.CharField(max_length=100)),
                ('circ_num', models.IntegerField()),
            ],
            options={
                'db_table': 'UserDensity',
            },
        ),
        migrations.CreateModel(
            name='UserTable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('md5', models.CharField(max_length=255)),
                ('gene_id', models.CharField(db_column='gene_id', default='', max_length=255)),
                ('chr_num', models.CharField(max_length=100)),
                ('start', models.IntegerField()),
                ('end', models.IntegerField()),
                ('name', models.CharField(max_length=255)),
                ('gene_type', models.CharField(max_length=100)),
                ('circ_on_gene_all', models.TextField()),
                ('circ_on_num', models.IntegerField()),
            ],
            options={
                'db_table': 'UserTable',
            },
        ),
        migrations.CreateModel(
            name='danRer11_species_circRNAs',
            fields=[
                ('species_circrnas_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_circRNAs')),
            ],
            options={
                'db_table': 'danRer11_circRNAs',
                'managed': False,
            },
            bases=('tools.species_circrnas',),
        ),
        migrations.CreateModel(
            name='danRer11_species_genome_exons_introns',
            fields=[
                ('species_genome_exons_introns_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_exons_introns')),
            ],
            options={
                'db_table': 'danRer11_genome_exons_introns',
                'managed': False,
            },
            bases=('tools.species_genome_exons_introns',),
        ),
        migrations.CreateModel(
            name='danRer11_species_genome_genes',
            fields=[
                ('species_genome_genes_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_genes')),
            ],
            options={
                'db_table': 'danRer11_genome_genes',
                'managed': False,
            },
            bases=('tools.species_genome_genes',),
        ),
        migrations.CreateModel(
            name='danRer11_species_genome_transcripts',
            fields=[
                ('species_genome_transcripts_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_transcripts')),
            ],
            options={
                'db_table': 'danRer11_genome_transcripts',
                'managed': False,
            },
            bases=('tools.species_genome_transcripts',),
        ),
        migrations.CreateModel(
            name='hg19_species_circRNAs',
            fields=[
                ('species_circrnas_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_circRNAs')),
            ],
            options={
                'db_table': 'hg19_circRNAs',
                'managed': False,
            },
            bases=('tools.species_circrnas',),
        ),
        migrations.CreateModel(
            name='hg19_species_genome_exons_introns',
            fields=[
                ('species_genome_exons_introns_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_exons_introns')),
            ],
            options={
                'db_table': 'hg19_genome_exons_introns',
                'managed': False,
            },
            bases=('tools.species_genome_exons_introns',),
        ),
        migrations.CreateModel(
            name='hg19_species_genome_genes',
            fields=[
                ('species_genome_genes_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_genes')),
            ],
            options={
                'db_table': 'hg19_genome_genes',
                'managed': False,
            },
            bases=('tools.species_genome_genes',),
        ),
        migrations.CreateModel(
            name='hg19_species_genome_transcripts',
            fields=[
                ('species_genome_transcripts_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_transcripts')),
            ],
            options={
                'db_table': 'hg19_genome_transcripts',
                'managed': False,
            },
            bases=('tools.species_genome_transcripts',),
        ),
        migrations.CreateModel(
            name='hg38_species_circRNAs',
            fields=[
                ('species_circrnas_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_circRNAs')),
            ],
            options={
                'db_table': 'hg38_circRNAs',
                'managed': False,
            },
            bases=('tools.species_circrnas',),
        ),
        migrations.CreateModel(
            name='hg38_species_genome_exons_introns',
            fields=[
                ('species_genome_exons_introns_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_exons_introns')),
            ],
            options={
                'db_table': 'hg38_genome_exons_introns',
                'managed': False,
            },
            bases=('tools.species_genome_exons_introns',),
        ),
        migrations.CreateModel(
            name='hg38_species_genome_genes',
            fields=[
                ('species_genome_genes_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_genes')),
            ],
            options={
                'db_table': 'hg38_genome_genes',
                'managed': False,
            },
            bases=('tools.species_genome_genes',),
        ),
        migrations.CreateModel(
            name='hg38_species_genome_transcripts',
            fields=[
                ('species_genome_transcripts_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_transcripts')),
            ],
            options={
                'db_table': 'hg38_genome_transcripts',
                'managed': False,
            },
            bases=('tools.species_genome_transcripts',),
        ),
        migrations.CreateModel(
            name='mm10_species_circRNAs',
            fields=[
                ('species_circrnas_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_circRNAs')),
            ],
            options={
                'db_table': 'mm10_circRNAs',
                'managed': False,
            },
            bases=('tools.species_circrnas',),
        ),
        migrations.CreateModel(
            name='mm10_species_genome_exons_introns',
            fields=[
                ('species_genome_exons_introns_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_exons_introns')),
            ],
            options={
                'db_table': 'mm10_genome_exons_introns',
                'managed': False,
            },
            bases=('tools.species_genome_exons_introns',),
        ),
        migrations.CreateModel(
            name='mm10_species_genome_genes',
            fields=[
                ('species_genome_genes_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_genes')),
            ],
            options={
                'db_table': 'mm10_genome_genes',
                'managed': False,
            },
            bases=('tools.species_genome_genes',),
        ),
        migrations.CreateModel(
            name='mm10_species_genome_transcripts',
            fields=[
                ('species_genome_transcripts_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_transcripts')),
            ],
            options={
                'db_table': 'mm10_genome_transcripts',
                'managed': False,
            },
            bases=('tools.species_genome_transcripts',),
        ),
        migrations.CreateModel(
            name='rn6_species_circRNAs',
            fields=[
                ('species_circrnas_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_circRNAs')),
            ],
            options={
                'db_table': 'rn6_circRNAs',
                'managed': False,
            },
            bases=('tools.species_circrnas',),
        ),
        migrations.CreateModel(
            name='rn6_species_genome_exons_introns',
            fields=[
                ('species_genome_exons_introns_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_exons_introns')),
            ],
            options={
                'db_table': 'rn6_genome_exons_introns',
                'managed': False,
            },
            bases=('tools.species_genome_exons_introns',),
        ),
        migrations.CreateModel(
            name='rn6_species_genome_genes',
            fields=[
                ('species_genome_genes_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_genes')),
            ],
            options={
                'db_table': 'rn6_genome_genes',
                'managed': False,
            },
            bases=('tools.species_genome_genes',),
        ),
        migrations.CreateModel(
            name='rn6_species_genome_transcripts',
            fields=[
                ('species_genome_transcripts_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_transcripts')),
            ],
            options={
                'db_table': 'rn6_genome_transcripts',
                'managed': False,
            },
            bases=('tools.species_genome_transcripts',),
        ),
        migrations.CreateModel(
            name='sacCer3_species_circRNAs',
            fields=[
                ('species_circrnas_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_circRNAs')),
            ],
            options={
                'db_table': 'sacCer3_circRNAs',
                'managed': False,
            },
            bases=('tools.species_circrnas',),
        ),
        migrations.CreateModel(
            name='sacCer3_species_genome_exons_introns',
            fields=[
                ('species_genome_exons_introns_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_exons_introns')),
            ],
            options={
                'db_table': 'sacCer3_genome_exons_introns',
                'managed': False,
            },
            bases=('tools.species_genome_exons_introns',),
        ),
        migrations.CreateModel(
            name='sacCer3_species_genome_genes',
            fields=[
                ('species_genome_genes_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_genes')),
            ],
            options={
                'db_table': 'sacCer3_genome_genes',
                'managed': False,
            },
            bases=('tools.species_genome_genes',),
        ),
        migrations.CreateModel(
            name='sacCer3_species_genome_transcripts',
            fields=[
                ('species_genome_transcripts_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tools.species_genome_transcripts')),
            ],
            options={
                'db_table': 'sacCer3_genome_transcripts',
                'managed': False,
            },
            bases=('tools.species_genome_transcripts',),
        ),
    ]
